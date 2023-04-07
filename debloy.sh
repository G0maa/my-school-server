cd my-school-server

# This is the dependency that keeps node
# running in the background, it is not added to the repo.. yet.
pm2 stop npm

# I've got some cors related stuff only changed inproduction
git stash

# Assuming you are on master
git pull origin master


npm install
npm run migration:downAll

git stash apply

# Takes few seconds until the server starts
pm2 start npm
