

(

cd ..
pwd
tar -zcvf STOPSOPA__argyle.tar.gz \
    --exclude "node_modules" \
    --exclude ".git" \
    --exclude "sd-project.sh" \
    --exclude "server-build" \
    --exclude "build" \
    --exclude "vite/dist" \
    --exclude "docker/mysql_db" \
    --exclude "coverage" \
    --exclude ".DS_Store" \
    --exclude "docker/fixtures/.env" \
    --exclude "docker/fixtures/log.log" \
    --exclude "*.zip" \
    STOPSOPA__argyle

rm -rf sd-project
mkdir -p sd-project/node
mv STOPSOPA__argyle.tar.gz sd-project/node


cd sd-project/node
tar -zxvf STOPSOPA__argyle.tar.gz

rm -rf STOPSOPA__argyle.tar.gz
pwd
mv STOPSOPA__argyle/* .
mv STOPSOPA__argyle/.* .
rm -rf STOPSOPA__argyle
mv README_PARENT.md ../README.md
cd ../..

# tar -zcvf sd-project.tar.gz sd-project
zip -r sd-project.zip sd-project

)

cp ../sd-project.zip .











