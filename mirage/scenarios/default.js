export default function (server) {
  server.createList('song', 10);
  server.get('/songs', (schema, request) => {
    return schema.songs.all();
  });
}
