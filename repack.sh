

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
    --exclude ".github" \
    --exclude "sd-project" \
    --exclude "docker/mysql_db" \
    --exclude "*.log" \
    --exclude "shell/.env" \
    --exclude "coverage" \
    --exclude ".DS_Store" \
    --exclude "docker/fixtures/.env" \
    --exclude "docker/fixtures/log.log" \
    --exclude "*.zip" \
    STOPSOPA__argyle

rm -rf sd-project.zip
rm -rf sd-project
mkdir -p sd-project/node
mv STOPSOPA__argyle.tar.gz sd-project/node


cd sd-project/node
tar -zxvf STOPSOPA__argyle.tar.gz

rm -rf STOPSOPA__argyle.tar.gz
mv STOPSOPA__argyle/* .
mv STOPSOPA__argyle/.* .
rm -rf STOPSOPA__argyle
mv README_PARENT.md ../README.md
mv Task.pdf ../Task.pdf
cd ../..

# # tar -zcvf sd-project.tar.gz sd-project
zip -r sd-project.zip sd-project
pwd
ls -la
ls -la sd-project/

)

cp ../sd-project.zip .











