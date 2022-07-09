import 'package:flutter/material.dart';
import 'package:flutter_app/album_tile.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class TopAlbums extends StatefulWidget {
  const TopAlbums({Key? key}) : super(key: key);

  @override
  State<TopAlbums> createState() => _TopAlbumsState();
}

class Album {
  final String title;
  final String artist;
  final String playcount;
  final String imageUrl;

  const Album({
    required this.title,
    required this.artist,
    required this.playcount,
    required this.imageUrl,
  });

  String getTitle() {
    return title;
  }

  factory Album.fromJson(Map<String, dynamic> json) {
    return Album(
      title: json['name'],
      artist: json['artist'],
      playcount: json['playcount'],
      imageUrl: json['image'][0]['#text'],
    );
  }
}

Future<List<Album>> fetchTopAlbums() async {
  final response = await http.get(Uri.parse(
      'https://j4c5vwl4eb.execute-api.ap-southeast-2.amazonaws.com/getTopAlbums'));

  if (response.statusCode == 200) {
    // If the server did return a 200 OK response,
    // then parse the JSON.
    List jsonAlbums = jsonDecode(response.body);

    List<Album> topAlbums =
        jsonAlbums.map((item) => Album.fromJson(item)).toList();
    return topAlbums;
  } else {
    // If the server did not return a 200 OK response,
    // then throw an exception.
    throw Exception('Failed to load album');
  }
}

class _TopAlbumsState extends State<TopAlbums> {
  late Future<List<Album>> futureTopAlbums;

  @override
  void initState() {
    super.initState();
    futureTopAlbums = fetchTopAlbums();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: FutureBuilder<List<Album>>(
          future: futureTopAlbums,
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              final albumTiles = snapshot.data!
                  .where((album) => album.imageUrl.isNotEmpty)
                  .map((Album album) => AlbumTile(album: album))
                  .toList();
              const albumGridWidth = 3;
              final albumsLength = albumTiles.length;
              final numberOfAlbumsToRemove = albumsLength % albumGridWidth;
              albumTiles.removeRange(
                  albumsLength - numberOfAlbumsToRemove, albumsLength);

              return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: GridView.count(
                      crossAxisCount: albumGridWidth, children: albumTiles));
            } else if (snapshot.hasError) {
              return Text('${snapshot.error}');
            }

            // By default, show a loading spinner.
            return const CircularProgressIndicator();
          },
        ),
      ),
    );
  }
}
