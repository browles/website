server {
	listen 80;
  listen [::]:80;
	server_name *.amazonaws.com;

	access_log /var/www/benrowles.com/logs/access.log;
	error_log /var/www/benrowles.com/logs/error.log;

  root   /var/www/benrowles.com/public/;
  index  index.html;
  location / {
    try_files $uri $uri/ =404;
  }
}

server {
	listen 80 default_server;
  listen [::]:80 default_server ipv6only=on;
	server_name benrowles.com www.benrowles.com;

	access_log /var/www/benrowles.com/logs/access.log;
	error_log /var/www/benrowles.com/logs/error.log;

  root   /var/www/benrowles.com/public/;
  index  index.html;
  location / {
    try_files $uri $uri/ =404;
  }
}
