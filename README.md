# nodebb-plugin-openapi-spec
openapi spec auto-generator for nodebb api

## Config page

![Screen Shot 2019-11-16 at 2 49 53 PM](https://user-images.githubusercontent.com/1398375/68993420-a973dc00-0880-11ea-991f-27f551325b5a.png)

## Spec JSON response

![Screen Shot 2019-11-16 at 2 51 31 PM](https://user-images.githubusercontent.com/1398375/68993421-a973dc00-0880-11ea-882b-8edf45896984.png)

## Swagger UI Page

![Screen Shot 2019-11-16 at 2 51 40 PM](https://user-images.githubusercontent.com/1398375/68993434-d32d0300-0880-11ea-98af-18b4312db5ea.png)


## Disclaimer

* This plugin currently supports OpenApi V2, V3 is in the works.
* This plugin is based on [NodeBB/express-oas-generator](https://github.com/NodeBB/express-oas-generator), which is a extensively modified fork of [mpashkovskiy/express-oas-generator](https://github.com/mpashkovskiy/express-oas-generator)
* This plugin continuously parses every HTTP request to add/edit the spec, so it might actually slow down your nodebb instance, as also mentioned [here](https://github.com/mpashkovskiy/express-oas-generator/blob/fae64b26fda2b40d66a99cd4594d3a21b1778909/README.md#rationale)