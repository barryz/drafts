{
/*
	// Place your snippets for Go here. Each snippet is defined under a snippet name and has a prefix, body and
	// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
	// $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. Placeholders with the
	// same ids are connected.
	// Example:
	"Print to console": {
		"prefix": "log",
		"body": [
			"console.log('$1');",
			"$2"
		],
		"description": "Log output to console"
	}
*/
	"Err handle snippet": {
		"prefix": "ife",
		"body": [
			"if err != nil {",
			"",
			"}"
		],
		"description": "err handler"
	},
	"Method snippet": {
		"prefix": "fn",
		"body": [
			"// ",
			"func (r *reciver) functionName() error {",
			"\treturn nil",
			"}"
		],
		"description": "create a method function"
	},
	"Json Unmarshal snippet": {
		"prefix": "ju",
		"body": [
			"if err := json.Unmarshal([]byte(), &t); err != nil {",
			"",
			"}"
		],
		"description": "json unmarshal"
	},
	"Json Marshal snippet": {
		"prefix": "jm",
		"body": [
			"bs, err := json.Marshal(payload)",
			"if err != nil {",
			"",
			"}"
		],
		"description": "json Marshal"
	},
	"Iterate Slice": {
		"prefix": "frs",
		"body": [
			"for _, i := range Slice {",
			"",
			"}"
		],
		"description": "iterate a slice"
	},
	"Iterate Map": {
		"prefix": "frm",
		"body": [
			"for k, v := range Map {",
			"",
			"}"
		],
		"description": "iterate a map"
	},
	"go func": {
		"prefix": "gf",
		"body": [
			"go func() {",
			"",
			"}()"
		],
		"description": "generate a goroutine func"
	},
	"type struct": {
		"prefix": "ts",
		"body": [
			"//",
			"type Type struct {",
			"",
			"}"
		],
		"description": "generate a struct define snippet"
	},
	"json tags": {
		"prefix": "jt",
		"body": [
				"`json:\"field\"`"
		],
		"description": "add a json tag"
	},
	"yaml tags": {
		"prefix": "yt",
		"body": [
				"`yaml:\"field\"`"
		],
		"description": "add a yaml tag"
	}
}
