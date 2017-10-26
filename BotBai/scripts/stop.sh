#!/bin/sh
file="scripts/bot.pid"
if [ -f "$file" ]
then
    echo "Killing process"
    pid="`cat $file`"
    echo $pid
    kill -9 $pid
    killall node
    rm $file
else
    echo "Killing all node instances"
fi
killall node