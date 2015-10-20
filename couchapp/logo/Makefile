all: \
	release/logo-192x192.png \
	release/logo-114x114.png \
	release/logo-72x72.png \
	release/logo-57x57.png

release/%.png: rasterized/%.png
	mkdir -p release
	pngcrush -reduce -brute $< $@

rasterized/%.png: logo.svg
	mkdir -p rasterized
	inkscape -z -e $@ \
		-w `echo $@ | sed 's/.*-\([0-9]\+\)x[0-9]\+.*/\1/'` \
		-h `echo $@ | sed 's/.*-[0-9]\+x\([0-9]\+\).*/\1/'` \
		$<
