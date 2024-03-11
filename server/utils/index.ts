export function randomDocumentationUrl() {
    const docs = docsRoutes;
    const randomDocIndex = Math.floor(Math.random() * docs.length);
    const randomDocItem = docs[randomDocIndex];
    return randomDocItem;
}
