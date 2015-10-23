#!/bin/bash

# varnish and squid are not presently in use

set -e

function killall() {
	docker stop readme-squid3 readme-couchdb readme-varnish
	docker rm readme-squid3 readme-couchdb readme-varnish
}

trap killall EXIT

docker run -d -p 5984:5984 -p 3128:3128 --name readme-couchdb klaemo/couchdb
docker run -d --name readme-squid3 --net container:readme-couchdb fgrehm/squid3-ssl:v20140809
docker run -d --name readme-varnish --net=host --env='VCL_CONFIG=/data/varnish.vcl' --env='VARNISHD_PARAMS=-a 0.0.0.0:8009' -v "$(pwd)":/data million12/varnish

until curl http://localhost:5984/ ; do sleep 1 ; done

curl -X PUT http://localhost:5984/_config/httpd/bind_address -d '"::"'

until curl http://localhost:5984/ ; do sleep 1 ; done

pushd couchapp
./build-debug.sh && couchapp push debug http://localhost:5984/readme
popd

echo "Running squid3 on 3128 and couchdb on 5984"
read -p "Press enter to stop"
