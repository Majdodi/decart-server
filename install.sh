#!/bin/bash
cd /home/decarftn/server || exit 1

# احذف node_modules إذا موجود
rm -rf node_modules

# ثبّت الحزم المطلوبة
npm install --force

# عدّل الصلاحيات
chmod -R 755 /home/decarftn/server

echo "✅ Installation completed successfully!"
