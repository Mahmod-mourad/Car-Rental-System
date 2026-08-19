# Car Rental System — common tasks.
# Run `make help` to see what's here.

BACKEND  := Car-Rental-System-backend
FRONTEND := Car-Rental-System-Frontend

.PHONY: help install env migrate dev-backend dev-frontend build test lint clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies for both apps
	cd $(BACKEND) && npm ci
	cd $(FRONTEND) && npm ci

env: ## Create .env files from the examples (does not overwrite)
	@[ -f $(BACKEND)/.env ] || cp $(BACKEND)/.env.example $(BACKEND)/.env
	@[ -f $(FRONTEND)/.env.local ] || cp $(FRONTEND)/.env.example $(FRONTEND)/.env.local
	@echo "Env files ready. Edit them before running in anything but local dev."

migrate: ## Run pending TypeORM migrations
	cd $(BACKEND) && npm run migration:run

dev-backend: ## Start the API on :3001
	cd $(BACKEND) && npm run start:dev

dev-frontend: ## Start the web app on :3000
	cd $(FRONTEND) && npm run dev

build: ## Production build for both apps
	cd $(BACKEND) && npm run build
	cd $(FRONTEND) && npm run build

test: ## Run both test suites
	cd $(BACKEND) && npm test
	cd $(FRONTEND) && npm test

lint: ## Lint both apps
	cd $(BACKEND) && npm run lint
	cd $(FRONTEND) && npm run lint

clean: ## Remove build output and installed packages
	rm -rf $(BACKEND)/dist $(BACKEND)/node_modules
	rm -rf $(FRONTEND)/.next $(FRONTEND)/node_modules
