ip=$(ifconfig -a | grep "inet " | grep -v -e " 127" -e " 100" | awk '{print $2}')
echo "\n\nAccess:"
echo "http://$ip:8001/index.html"
echo "\n\n"
set -x 
python3 -m http.server -b $ip 8001
