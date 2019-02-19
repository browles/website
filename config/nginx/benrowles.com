server {
	listen   80;
	server_name *.amazonaws.com;

	access_log /var/www/benrowles.com/logs/access.log;
	error_log /var/www/benrowles.com/logs/error.log;

	location / {
		root   /var/www/benrowles.com/public/;
		index  index.html;
	}
}

server {
	listen   80;
	server_name www.benrowles.com;
	rewrite ^/(.*) https://benrowles.com/$1 permanent;
}

server {
	listen   80;
	server_name benrowles.com;

	access_log /var/www/benrowles.com/logs/access.log;
	error_log /var/www/benrowles.com/logs/error.log;

	location / {
		root   /var/www/benrowles.com/public/;
		index  index.html;
	}
}
