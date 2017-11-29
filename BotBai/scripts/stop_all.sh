#!/bin/bash

# Delete Log
sudo rm err.log out.log

# Stop Mongo
sudo service mongod stop
# Stop Forever
sudo kill $(ps aux | grep forever | awk '{print $2}')
