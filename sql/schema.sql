-- PostgreSQL schema for RouteAura AI features

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  preferences JSONB,
  budget INTEGER,
  travel_style VARCHAR(128)
);

CREATE TABLE IF NOT EXISTS places (
  id SERIAL PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  location JSONB,
  category VARCHAR(128)
);

CREATE TABLE IF NOT EXISTS live_metrics (
  id SERIAL PRIMARY KEY,
  place_id INTEGER NOT NULL,
  crowd_level VARCHAR(32),
  noise_level VARCHAR(32),
  waiting_time INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_activity (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  location JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);
