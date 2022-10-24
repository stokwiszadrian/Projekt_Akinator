const axios = require('axios')

const sparql_string = `
SELECT DISTINCT ?itemLabel WHERE {
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE]". }
  {
    SELECT DISTINCT ?item
    WHERE {
     ?item wdt:P31 wd:Q5 ;
     wdt:P214 []
    }
    LIMIT 100000
  }
}
`
axios.get("https://query.wikidata.org/sparql", {
    params: {
        "query": sparql_string,
        "format": "json"
    }
}).then(res => console.log(res))