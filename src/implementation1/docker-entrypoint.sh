#!/bin/bash
set -e

# Attempt sysctl tuning, but do not exit if it fails
echo "Applying recommended sysctl settings..."
sysctl -w net.core.somaxconn=65535 || true                     // TCP backlog queue.
sysctl -w net.ipv4.ip_local_port_range="1024 65535" || true
sysctl -w net.ipv4.tcp_tw_reuse=1 || true

# Adjust file descriptor limits
ulimit -n 65536 || true                                        //  file descriptor

# Start the application
if [ $# -eq 0 ]; then
    echo "No command provided, defaulting to 'node index.js'"
    exec node index.js
else
    exec "$@"
fi
