
import re
import googlemaps
import time

from googlemaps.exceptions import TransportError
from raw_html import data
from  __settings import GOOGLE_GEOCODE_API_KEY

gmaps = googlemaps.Client(key=GOOGLE_GEOCODE_API_KEY)

def geocode_google(city, country):
    """
    Geocode against Google
    Return point as array of [lat, lng] if geocoded, None otherwise.
    """
    time.sleep(1)
    try:
        address_submission = "{} {}".format(city.strip(), country.strip())
        
        geocode_results = gmaps.geocode(address = address_submission)

        if len(geocode_results):
            return geocode_results[0]['geometry']['location']
        else:
            return None
    except TransportError as e:
        print("Google geocoding error: {}".format(e))
        return None


inputArray = data.split("\n")
currentCountry = ""
currentName = ""
currentCity = ""
currentDate = ""
currentCause = ""

people = []

for row in inputArray:
##    print(row)
    countrySearch = re.search(u"<p><strong>(.*)</strong></p>", row)
    nameSearch = re.search(u"<p>(.*)<br>", row)
    dateSearch = re.search(u"([0-9]{1,2}-[a-zA-Z]*-[0-9]{2})<br>", row)
    cityDateSearch = re.search(u"(.*)<br>", row) # will match cities AND dates
    causeSearch = re.search(u"(.*)</p>", row)
    if countrySearch:
        currentCountry = countrySearch.group(1)
##        print(currentCountry)
    elif nameSearch:
        coordinates = geocode_google(currentCity, currentCountry)
        newPerson = {
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [coordinates['lng'], coordinates['lat']],
              },
                      'properties': {
                            'name': currentName,
                            'city': currentCity,
                            'date': currentDate,
                            'cause': currentCause,
              }
        }
#         print(newPerson)
        if coordinates:
            people.append(newPerson)
        
        currentName = nameSearch.group(1)
##        print(currentName)
    elif dateSearch:
        currentDate = dateSearch.group(1)
##        print(currentDate)
    elif cityDateSearch:
        currentCity = cityDateSearch.group(1)
##        print(currentCity)
    elif causeSearch:
        currentCause = causeSearch.group(1)
##        print(currentCause)

print("FINAL")
print(people)