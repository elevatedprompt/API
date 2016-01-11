#!/bin/bash
# Install AdminPanel API
sudo npm install pm2 -g
sudo pm2 completion install
sudo pm2 startup
sudo chkconfig /etc/init.d/pm2-init.sh on
sudo /etc/init.d/pm2-init.sh start
sudo npm install
sudo pm2 start index.js --name epstack-API
