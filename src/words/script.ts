export default function run() {
    console.log(words)
    let jsonStr = "["
    let open = false
    for (let i = 0; i < words.length; i++) {
        const char = words[i];

        if (char !== "\n") {
            jsonStr += `${open ? "" : "\""}${char}`
            if (!open)
                open = true
        }
        else {
            jsonStr += "\","
            open = false
        }
    }
    jsonStr += ']'
    console.log(jsonStr)
    console.log(JSON.parse(jsonStr))
}

const words = ``
