#!/bin/bash
# Install AdminPanel web
sudo mkdir -p /var/www/epstack/
sudo cd /var/www/epstack/
sudo git clone https://github.com/elevatedprompt/public_html
sudo chown -R apache:apache /var/www/epstack/public_html
sudo chmod 755 /var/www
