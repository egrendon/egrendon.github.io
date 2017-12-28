

// Command to Install
sudo npm install -g live-server

// STEPS to RUN
Go to some folder that has a <SOME_PATH> index.html

// STEPS to RUN
then run command 'live-server'


Command line parameters:

--port=NUMBER - select port to use (can also be done with PORT environment variable)
--host=ADDRESS - select host address to bind to, default: 0.0.0.0 ("any address")
--no-browser - suppress automatic web browser launching
--browser=BROWSER - specify browser to use instead of system default
--quiet - suppress logging
--open=PATH - launch browser to PATH instead of server root
--ignore=PATH - comma-separated string of paths to ignore
--entry-file=PATH - serve this file in place of missing files (useful for single page apps)
--mount=ROUTE:PATH - serve the paths contents under the defined route (multiple definitions possible)
--wait=MILLISECONDS - wait for all changes, before reloading
--help | -h - display terse usage hint and exit
--version | -v - display version and exit
Default options:

If a file ~/.live-server.json exists it will be loaded and used as default options for live-server on the command line. See "Usage from node" for option names.
