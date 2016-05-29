#!/bin/bash

set -euo pipefail

cd "$(dirname $0)"

rm -rf debug
mkdir -p debug/{_attachments,lists,shows,templates,updates,views,lib}

make -j -C logo
cp logo/release/logo*.png debug/_attachments

cp -r design_doc/_attachments/* debug/_attachments &
cp design_doc/{_id,rewrites.json} debug/ &

for SRC in $(find design_doc -iname '*.js' \( -type f -or -type l \))
do
	TRG="debug/$(echo "$SRC" | cut -d/ -f 1 --complement)"
	echo "$SRC -> $TRG"
	mkdir -p $(dirname "$TRG")
	cp "$SRC" "$TRG"
done

./dottojs.js -s design_doc/templates/ -d debug/templates/ &

cp design_doc/templates/*.html debug/templates/ &

./node_modules/.bin/browserify \
	--debug \
	-r './design_doc/lib/react:lib/react' \
	-r './design_doc/lib/component/feed-config:lib/component/feed-config' \
	> debug/_attachments/all.js &

wait

couchapp push --export debug > debug.json
xz < debug.json > debug.json.xz
