#!/bin/bash

function process_file {
    echo "Processing $1 ...";
    cd /usr/share/nginx/html/music-hub-app;
    if [[ ! -f $1.tmpl.js ]]
    then
      cp $1 $1.tmpl.js
    fi

    envsubst '$PRODUCTION, $API_URL, $CALL_URL, $CHAT_URL' < $1.tmpl.js > $1
}

FILES=$(ls /usr/share/nginx/html/music-hub-app | grep '.js$')

for file in $FILES
do
  process_file "$file"
done

echo "Starting Nginx"
nginx -g 'daemon off;'
