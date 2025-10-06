import 'package:flutter/material.dart';

class AddressBar extends StatefulWidget {
  const AddressBar({super.key, required this.onSubmit, required this.text, required this.onMenu});

  final ValueChanged<String> onSubmit;
  final String text;
  final VoidCallback onMenu;

  @override
  State<AddressBar> createState() => _AddressBarState();
}

class _AddressBarState extends State<AddressBar> {
  late final TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.text);
  }

  @override
  void didUpdateWidget(covariant AddressBar oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.text != widget.text && _controller.text != widget.text) {
      _controller.text = widget.text;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 40,
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(10),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 12),
      child: Row(
        children: [
          const Icon(Icons.lock_open, size: 18),
          const SizedBox(width: 8),
          Expanded(
            child: TextField(
              controller: _controller,
              decoration: const InputDecoration(
                hintText: 'Search or enter address',
                border: InputBorder.none,
                isDense: true,
              ),
              onSubmitted: widget.onSubmit,
              textInputAction: TextInputAction.go,
            ),
          ),
          IconButton(
            icon: const Icon(Icons.more_vert, size: 20),
            splashRadius: 18,
            onPressed: widget.onMenu,
          )
        ],
      ),
    );
  }
}
