EXTENSION = nice-focus@apps.mirsobhan.ir

.PHONY: pack format clean lint validate build

pack:
	cd $(EXTENSION) && zip -r ../$(EXTENSION).zip ./*

format:
	prettier --write $(EXTENSION)/extension.js --use-tabs

lint:
	prettier --check $(EXTENSION)/extension.js

validate:
	test -f $(EXTENSION)/extension.js || (echo "Missing extension.js!" && exit 1)

clean:
	rm -f $(EXTENSION).zip

build: validate format pack
