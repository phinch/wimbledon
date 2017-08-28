import csv
import math

reader = csv.reader(open('wimbledon.csv', 'r'))
# skip the header in the csv file
next(reader, None)

#Round,Duration,Winner,Sets,Set1,Set2,Set3,Set4,Set5,Tiebreaks,Rank1,Aces1,Winners1,Errors1,Dist1,Rank2,Aces2,Winners2,Errors2,Dist2
round_no = 0
duration = 1
sets = 3
set1 = 4
set2 = 5
set3 = 6
set4 = 7
set5 = 8
tiebreaks = 9
rank1 = 10
aces1 = 11
winners1 = 12
errors1 = 13
distance1 = 14
rank2 = 15
aces2 = 16
winners2 = 17
errors2 = 18
distance2 = 19

# Rank diff, total sets, tiebreakers, avg game diff per set, aces diff, winners diff, errors diff, distance diff, duration
# Round, total aces, total winners, total errors, total distance, sets, tiebreaks, duration?
with open('by_rank.csv', 'w', newline = '') as rank_file:
    with open('by_round.csv', 'w', newline = '') as round_file:
        rank_writer = csv.writer(rank_file)
        round_writer = csv.writer(round_file)

        rank_writer.writerow(['rank_diff','sets','tiebreaks','game_diff','ace_diff','winners_diff','errors_diff','distance_diff','duration'])
        round_writer.writerow(['round','aces','winners','errors','distance'])

        count = 0
        for line in reader:
            count += 1
            print(count)
            by_rank = [abs(int(line[rank1])-int(line[rank2])),line[sets],line[tiebreaks]]
            gamediff = [0, 0]
            for i in range(4, 9):
                if(line[i] != -1):
                    gamediff[0] += abs(int(line[i]))
                    gamediff[1] += 1

            gamediff = gamediff[0]/gamediff[1]
            by_rank.append(gamediff)

            if line[distance1] == "N/A":
                distance_diff = "N/A"
                distance_total = "N/A"
            else:
                distance_diff = abs(float(line[distance1])-float(line[distance2]))
                distance_total = float(line[distance1])+float(line[distance2])
            

            by_rank.extend([abs(int(line[aces1])-int(line[aces2])), abs(int(line[winners1])-int(line[winners2])), abs(int(line[errors1])-int(line[errors2])), distance_diff, line[duration]])
            rank_writer.writerow(by_rank)

            by_round = [line[round_no], int(line[aces1])+int(line[aces2]), int(line[winners1])+int(line[winners2]), int(line[errors1])+int(line[errors2]), distance_total, line[sets], line[tiebreaks], line[duration]]
            round_writer.writerow(by_round)
            
    

    
