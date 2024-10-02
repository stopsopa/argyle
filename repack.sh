

(
set -e
rm -rf sd-project.zip
rm -rf sd-project
rm -rf STOPSOPA__argyle.tar.gz
chmod a+w .husky/pre-commit

cd ..
tar -cvf STOPSOPA__argyle.tar.gz \
    --exclude "*.log" \
    --exclude ".DS_Store" \
    --exclude "*.zip" \
    --exclude "STOPSOPA__argyle/node_modules" \
    --exclude "STOPSOPA__argyle/.git" \
    --exclude "STOPSOPA__argyle/build" \
    --exclude "STOPSOPA__argyle/vite/dist" \
    --exclude "STOPSOPA__argyle/docker/mysql_db" \
    --exclude "STOPSOPA__argyle/shell/.env" \
    --exclude "STOPSOPA__argyle/coverage" \
    --exclude "STOPSOPA__argyle/docker/fixtures/.env" \
    --exclude "STOPSOPA__argyle/docker/fixtures/log.log" \
    STOPSOPA__argyle
set -x

tar -rvf STOPSOPA__argyle.tar.gz STOPSOPA__argyle/.husky/pre-commit
rm -rf sd-project/node
mkdir -p sd-project/node
mv STOPSOPA__argyle.tar.gz sd-project/node


cd sd-project/node
tar -zxvf STOPSOPA__argyle.tar.gz


rm -rf STOPSOPA__argyle.tar.gz
mv STOPSOPA__argyle/* . || true
mv STOPSOPA__argyle/.* . || true
# ls -la .husky/
rm -rf .husky/_/
# ls -la .husky/
rm -rf STOPSOPA__argyle

mv README_PARENT.md ../README.md
mv Task.pdf ../Task.pdf
cd ../..

# # tar -zcvf sd-project.tar.gz sd-project
zip -r sd-project.zip sd-project
ls -la
)

mv ../sd-project.zip .


