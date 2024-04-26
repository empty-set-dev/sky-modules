// import fs from 'fs'

declare module 'fs' {
    function copyFilesDeepSync(from: string, to: string): void
}

// fs.copyFilesDeepSync = function copyFilesDeepSync(from: string, to: string): void {
//     const files = fs.readdirSync(from)

//     for (const file of files) {
//         const stat = fs.statSync(from + '/' + file)
//         // console.log(stat)
//     }
// }
