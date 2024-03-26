twodaysbefore=$(python -c "from dateutil.relativedelta import relativedelta; from datetime import datetime; print((datetime.now() - relativedelta(days=2)).strftime('%Y-%m-%d'))")

# move old data files to backup folder
echo "Backing up current data ..."
cd ../Data/
mkdir backup/$twodaysbefore
mv allData_$twodaysbefore.json backup/$twodaysbefore/
mv cnnPortugal_$twodaysbefore.json backup/$twodaysbefore/
mv jornalNoticias_$twodaysbefore.json backup/$twodaysbefore/
mv publico_$twodaysbefore.json backup/$twodaysbefore/
mv expresso_$twodaysbefore.json backup/$twodaysbefore/
mv observador_$twodaysbefore.json backup/$twodaysbefore/
mv sicNoticias_$twodaysbefore.json backup/$twodaysbefore/
echo "Backup finish."