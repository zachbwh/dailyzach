import 'package:flutter/material.dart';
import 'package:flutter_app/top_albums.dart';

class AlbumTile extends StatefulWidget {
  const AlbumTile({Key? key, required this.album}) : super(key: key);

  final Album album;

  @override
  State<AlbumTile> createState() => _AlbumTileState();
}

class _AlbumTileState extends State<AlbumTile> {

  @override
  Widget build(BuildContext context) {
    return Image.network(widget.album.imageUrl);
  }
}
