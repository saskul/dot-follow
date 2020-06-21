#!/bin/bash

if [[ "$1" != "" ]]; then 
	echo "Docker host port mapped to container = $1"
	if [[ "$2" != "" ]]; then
		echo "Docker container exposed port = $1"
		docker run -p $1:$2 --name=dot -e=PORT=$2 -e=API_BASE_URL=10.0.0.40:$2 dot-follow
	else
		echo "Pass container exposed port as a second parameter"
	fi		
else
	echo "Pass docker host mapped port as a first parameter"
fi
