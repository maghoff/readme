#!/bin/bash

set -e

UGLIFYJS="./node_modules/.bin/uglifyjs --screw-ie8 --compress --mangle"

rm -rf release
mkdir -p release/{_attachments,lists,shows,templates,updates,views,lib}

# Make changes CWD, so we have to wait for it to finish
make -j -C logo && cp logo/release/logo*.png release/_attachments

cp -r design_doc/_attachments/* release/_attachments &
cp design_doc/{_id,rewrites.json} release/ &

for SRC in $(find design_doc -iname '*.js' \( -type f -or -type l \))
do
	TRG="release/$(echo "$SRC" | cut -d/ -f 1 --complement)"
	echo "$SRC -> $TRG"
	mkdir -p $(dirname "$TRG")
	cat "$SRC" \
		| sed 's/^function\s*(/function PLACEHOLDER(/' \
		| $UGLIFYJS \
		| sed 's/^function PLACEHOLDER(/function(/' \
		> "$TRG" &
done

./dottojs.js -s design_doc/templates/ -d release/templates/ &

cp design_doc/templates/*.html release/templates/ &

./node_modules/.bin/browserify \
	-r './design_doc/lib/react:lib/react' \
	-r './design_doc/lib/component/feed-config:lib/component/feed-config' \
	| $UGLIFYJS \
	> release/_attachments/all.js &

wait
