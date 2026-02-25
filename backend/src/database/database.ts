import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database;

export function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/crm.db');
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function initializeDatabase(): void {
  const database = getDatabase();

  database.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      company TEXT,
      job_title TEXT,
      source TEXT,
      tags TEXT DEFAULT '[]',
      custom_fields TEXT DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      contact_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      score REAL DEFAULT 0,
      score_factors TEXT DEFAULT '[]',
      assigned_to TEXT,
      source TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (contact_id) REFERENCES contacts(id)
    );

    CREATE TABLE IF NOT EXISTS opportunities (
      id TEXT PRIMARY KEY,
      contact_id TEXT NOT NULL,
      lead_id TEXT,
      title TEXT NOT NULL,
      value REAL DEFAULT 0,
      currency TEXT DEFAULT 'EUR',
      stage TEXT NOT NULL DEFAULT 'prospecting',
      probability REAL DEFAULT 0,
      expected_close_date TEXT,
      assigned_to TEXT,
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (contact_id) REFERENCES contacts(id),
      FOREIGN KEY (lead_id) REFERENCES leads(id)
    );

    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      contact_id TEXT NOT NULL,
      subject TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      priority TEXT NOT NULL DEFAULT 'medium',
      assigned_to TEXT,
      sentiment TEXT,
      channel TEXT NOT NULL DEFAULT 'email',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (contact_id) REFERENCES contacts(id)
    );

    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      contact_id TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      metadata TEXT DEFAULT '{}',
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (contact_id) REFERENCES contacts(id)
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      contact_id TEXT NOT NULL,
      channel TEXT NOT NULL,
      subject TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (contact_id) REFERENCES contacts(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      sender TEXT NOT NULL,
      sender_name TEXT NOT NULL,
      content TEXT NOT NULL,
      channel TEXT NOT NULL,
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      metadata TEXT DEFAULT '{}',
      FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    );

    CREATE TABLE IF NOT EXISTS segments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      rules TEXT DEFAULT '[]',
      contact_count INTEGER DEFAULT 0,
      is_dynamic INTEGER DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS workflows (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      trigger_config TEXT DEFAULT '{}',
      steps TEXT DEFAULT '[]',
      is_active INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS integrations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'inactive',
      config TEXT DEFAULT '{}',
      last_sync_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS next_best_actions (
      id TEXT PRIMARY KEY,
      contact_id TEXT NOT NULL,
      action TEXT NOT NULL,
      reason TEXT NOT NULL,
      priority REAL DEFAULT 0,
      channel TEXT DEFAULT 'email',
      suggested_at TEXT NOT NULL DEFAULT (datetime('now')),
      status TEXT NOT NULL DEFAULT 'pending',
      FOREIGN KEY (contact_id) REFERENCES contacts(id)
    );

    CREATE TABLE IF NOT EXISTS dashboards (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      widgets TEXT DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_leads_contact_id ON leads(contact_id);
    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_opportunities_contact_id ON opportunities(contact_id);
    CREATE INDEX IF NOT EXISTS idx_opportunities_stage ON opportunities(stage);
    CREATE INDEX IF NOT EXISTS idx_tickets_contact_id ON tickets(contact_id);
    CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
    CREATE INDEX IF NOT EXISTS idx_activities_contact_id ON activities(contact_id);
    CREATE INDEX IF NOT EXISTS idx_conversations_contact_id ON conversations(contact_id);
    CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
    CREATE INDEX IF NOT EXISTS idx_next_best_actions_contact_id ON next_best_actions(contact_id);
  `);
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = undefined as unknown as Database.Database;
  }
}
