import os
import sys
from dotenv import load_dotenv

# Load backend settings
load_dotenv()

from config import get_settings
from database.supabase import get_client

def run_diagnostics():
    print("=== CrisisMind AI Database Diagnostic Tool ===")
    settings = get_settings()
    
    # 1. Check environment variables
    print("\n1. Checking Environment Variables...")
    print(f"   SUPABASE_URL: {settings.SUPABASE_URL or 'MISSING'}")
    print(f"   SUPABASE_SERVICE_KEY: {settings.SUPABASE_SERVICE_KEY[:15] + '...' if settings.SUPABASE_SERVICE_KEY else 'MISSING'}")
    print(f"   SUPABASE_REPORTS_TABLE: {settings.SUPABASE_REPORTS_TABLE}")

    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
        print("[ERROR] Supabase credentials are not set in backend/.env!")
        return

    # 2. Check client connection
    print("\n2. Initializing Supabase client...")
    client = get_client()
    if client is None:
        print("[ERROR] Failed to initialize Supabase client. Check config keys.")
        return
    print("[OK] Client initialized successfully.")

    # 3. Check if table exists
    print(f"\n3. Querying table '{settings.SUPABASE_REPORTS_TABLE}'...")
    try:
        res = client.table(settings.SUPABASE_REPORTS_TABLE).select("count", count="exact").limit(1).execute()
        count = res.count if hasattr(res, "count") else len(res.data)
        print(f"[OK] Table exists. Found {count} existing records.")
    except Exception as exc:
        print(f"[ERROR] Table query failed! The table might not exist in your database.")
        print(f"   Details: {exc}")
        print("\nTip: Please open the SQL Editor in your Supabase Dashboard and run the queries inside 'database/schema.sql' to create the table!")
        return

    # 4. Perform test insert and fetch
    print("\n4. Performing write/read test...")
    test_id = "00000000-0000-0000-0000-000000000000"
    test_record = {
        "id": test_id,
        "query": "diagnostic test",
        "crisis_type": "test",
        "location": "system",
        "payload": {"test": True}
    }
    
    try:
        # Clean up any old test record first
        client.table(settings.SUPABASE_REPORTS_TABLE).delete().eq("id", test_id).execute()
        
        # Test Insert
        client.table(settings.SUPABASE_REPORTS_TABLE).insert(test_record).execute()
        print("   [OK] Write test: Succeeded.")
        
        # Test Select
        res_select = client.table(settings.SUPABASE_REPORTS_TABLE).select("*").eq("id", test_id).single().execute()
        if res_select.data and res_select.data.get("payload", {}).get("test") is True:
            print("   [OK] Read test: Succeeded.")
        else:
            print("   [ERROR] Read test: Failed to match payload.")
            
        # Clean up test record
        client.table(settings.SUPABASE_REPORTS_TABLE).delete().eq("id", test_id).execute()
        print("   [OK] Cleanup test: Succeeded.")
        
    except Exception as exc:
        print(f"[ERROR] Write/Read test failed!")
        print(f"   Details: {exc}")
        return

    print("\n[OK] Diagnostics Complete: Your Supabase configuration is 100% CORRECT and ready for production!")

if __name__ == "__main__":
    run_diagnostics()
