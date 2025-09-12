.PHONY: help main update start

help: ## Show this message
	@echo "Available commands:"
	@awk 'BEGIN {FS = ":.*##"; printf "\n"} /^[a-zA-Z_-]+:.*##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) }' $(MAKEFILE_LIST)

main: ## Checkout main branch && git pull
	git checkout main && git pull

update: ## Update/install dependencies Back/Front
	if [ -f api/composer.lock ]; then cd api && composer update; else cd api && composer install; fi
	if [ -f web/package-lock.json ]; then cd web && npm update; else cd web && npm install; fi

start: ## Start API and Web
	cd api && php artisan serve &
	cd web && npm run dev &