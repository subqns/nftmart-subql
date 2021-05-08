CREATE TABLE IF NOT EXISTS accounts (
	id VARCHAR(48) NOT NULL, 
	created_at TIMESTAMP NULL, 
	updated_at TIMESTAMP NULL
);
CREATE TABLE IF NOT EXISTS blocks (
	id VARCHAR(96) NOT NULL, 
	number DECIMAL NOT NULL, 
	timestamp TIMESTAMP NULL, 
	parent_hash VARCHAR(96) NOT NULL, 
	spec_version DECIMAL NOT NULL, 
	created_at TIMESTAMP NULL, 
	updated_at TIMESTAMP NULL
);
CREATE TABLE IF NOT EXISTS calls (
	id VARCHAR(96) NOT NULL, 
	section VARCHAR(128) NOT NULL, 
	method VARCHAR(128) NOT NULL, 
	args TEXT NOT NULL, 
	timestamp TIMESTAMP NULL, 
	is_success BOOL NOT NULL, 
	signer_id VARCHAR(48) NOT NULL, 
	extrinsic_id VARCHAR(96) NOT NULL, 
	parent_call_id VARCHAR(96) NULL, 
	created_at TIMESTAMP NULL, 
	updated_at TIMESTAMP NULL
);
CREATE TABLE IF NOT EXISTS events (
	id VARCHAR(32) NOT NULL, 
	`index` DECIMAL NOT NULL, 
	section VARCHAR(128) NOT NULL, 
	method VARCHAR(128) NOT NULL, 
	data TEXT NOT NULL, 
	block_id VARCHAR(96) NOT NULL, 
	extrinsic_id VARCHAR(96) NULL, 
	created_at TIMESTAMP NULL, 
	updated_at TIMESTAMP NULL
);
CREATE TABLE IF NOT EXISTS extrinsics (
	id VARCHAR(96) NOT NULL, 
	method VARCHAR(128) NOT NULL, 
	section VARCHAR(128) NOT NULL, 
	args TEXT NOT NULL, 
	signer_id VARCHAR(48) NOT NULL, 
	nonce DECIMAL NOT NULL, 
	timestamp TIMESTAMP NULL, 
	signature VARCHAR(130) NOT NULL, 
	tip NUMERIC NOT NULL, 
	is_signed BOOL NOT NULL, 
	is_success BOOL NOT NULL, 
	block_id VARCHAR(96) NOT NULL, 
	created_at TIMESTAMP NULL, 
	updated_at TIMESTAMP NULL
);
