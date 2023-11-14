interface IFile {
    _id: string,
    type: string,
    path: string,
    tag: string
}

interface IWorkExample {
    _id: string,
    file: IFile,
    occasions: string
}