import csv
import math

reader = csv.reader(open('by_rank.csv', 'r'))
# skip the header in the csv file
next(reader, None)

#rank_diff,sets,tiebreaks,game_diff,ace_diff,winners_diff,errors_diff,distance_diff,duration
rank_diff = 0
sets = 1
tiebreaks = 2
game_diff = 3
ace_diff = 4
winners_diff = 5
errors_diff = 6
distance_diff = 7
duration = 8

cut1 = 5
cut2 = 15

diff1 = [0, 0, 0, 0, 0, 0, 0, 0]
diff2 = [0, 0, 0, 0, 0, 0, 0, 0]
diff3 = [0, 0, 0, 0, 0, 0, 0, 0]

for line in reader:
    if int(line[rank_diff]) < cut1:
        category = diff1
    elif int(line[rank_diff]) < cut2:
        category = diff2
    else:
        category = diff3

    

    category[0] += int(line[sets])
    category[1] += int(line[tiebreaks])
    category[2] += float(line[game_diff])
    category[3] += int(line[ace_diff])
    category[4] += int(line[winners_diff])
    category[5] += int(line[errors_diff])
    category[6] += int(line[duration])
    category[7] += 1

for i in range(0, 7):
    diff1[i] /= diff1[len(diff1)-1]
    diff2[i] /= diff2[len(diff2)-1]
    diff3[i] /= diff3[len(diff3)-1]
            
with open('rank_differential.csv', 'w', newline = '') as f:
    writer = csv.writer(f)
    writer.writerow(['sets', 'tiebreaks','game_diff','ace_diff','winners_diff','errors_diff','duration','entries'])
    writer.writerow(diff1)
    writer.writerow(diff2)
    writer.writerow(diff3)


reader = csv.reader(open('by_round.csv', 'r'))
# skip the header in the csv file
next(reader, None)

#round,aces,winners,errors,distance,sets,tiebreaks
round_no = 0
aces = 1
winners = 2
errors = 3
distance = 4
sets = 5
tiebreaks = 6

round1 = [0, 0, 0, 0, 0, 0, 0, 0]
round2 = [0, 0, 0, 0, 0, 0, 0, 0]
round3 = [0, 0, 0, 0, 0, 0, 0, 0]
round4 = [0, 0, 0, 0, 0, 0, 0, 0]
round5 = [0, 0, 0, 0, 0, 0, 0, 0]
round6 = [0, 0, 0, 0, 0, 0, 0, 0]
round7 = [0, 0, 0, 0, 0, 0, 0, 0]

rounds = [round1, round2, round3, round4, round5, round6, round7]

for line in reader:
    rnd = rounds[int(line[round_no])-1]
    rnd[0] += int(line[aces])
    rnd[1] += int(line[winners])
    rnd[2] += int(line[errors])
    rnd[len(rnd)-2] += 1
    rnd[4] += int(line[sets])
    rnd[5] += int(line[tiebreaks])

    if line[distance] != "N/A":
        rnd[3] += float(line[distance])
        rnd[len(rnd)-1] += 1

for rnd in rounds:
    for i in range(0, 6):
        if i == 3:
            continue
        rnd[i] /= rnd[len(rnd)-2]

    rnd[3] /= rnd[len(rnd)-1]

"""
maxes = [0, 0, 0, 0, 0, 0]
for rnd in rounds:
    for i in range(0, 6):
        maxes[i] = max(rnd[i], maxes[i])

for rnd in rounds:
    for i in range(0, 6):
        rnd[i] /= maxes[i]
"""

with open('round_differential_raw.csv', 'w', newline = '') as f:
    writer = csv.writer(f)
    writer.writerow(['aces','winners','errors','distance','sets','tiebreaks','entries','with_dist'])
    for rnd in rounds:
        writer.writerow(rnd)
    
