#!/bin/bash
# Install AdminPanel web
sudo mkdir -p /var/www/epstack/
cd /var/www/epstack/
sudo git clone -b develop https://github.com/elevatedprompt/public_html
sudo chown -R apache:apache /var/www/epstack/public_html
sudo chmod 755 /var/www
