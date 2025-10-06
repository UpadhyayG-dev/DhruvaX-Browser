import 'package:flutter/material.dart';

class TabStripItem {
  const TabStripItem({required this.id, required this.title, required this.isPrivate});
  final String id;
  final String title;
  final bool isPrivate;
}

class TabStrip extends StatelessWidget {
  const TabStrip({super.key, required this.tabs, required this.activeIndex, required this.onAdd, required this.onClose, required this.onTap});

  final List<TabStripItem> tabs;
  final int activeIndex;
  final VoidCallback onAdd;
  final ValueChanged<String> onClose;
  final ValueChanged<int> onTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 40,
      padding: const EdgeInsets.symmetric(horizontal: 8),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainer,
        border: Border(bottom: BorderSide(color: Theme.of(context).dividerColor)),
      ),
      child: Row(
        children: [
          Expanded(
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemBuilder: (context, index) {
                final TabStripItem tab = tabs[index];
                final bool isActive = index == activeIndex;
                return GestureDetector(
                  onTap: () => onTap(index),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 160),
                    curve: Curves.easeOut,
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: isActive
                          ? Theme.of(context).colorScheme.surfaceContainerHighest
                          : Theme.of(context).colorScheme.surfaceContainerLow,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(tab.isPrivate ? Icons.visibility_off : Icons.language, size: 16),
                        const SizedBox(width: 8),
                        ConstrainedBox(
                          constraints: const BoxConstraints(maxWidth: 180),
                          child: Text(
                            tab.title.isEmpty ? (tab.isPrivate ? 'Private Tab' : 'New Tab') : tab.title,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 8),
                        GestureDetector(
                          onTap: () => onClose(tab.id),
                          child: const Icon(Icons.close, size: 16),
                        ),
                      ],
                    ),
                  ),
                );
              },
              separatorBuilder: (context, index) => const SizedBox(width: 8),
              itemCount: tabs.length,
            ),
          ),
          const SizedBox(width: 8),
          IconButton(
            onPressed: onAdd,
            icon: const Icon(Icons.add),
            tooltip: 'New tab',
          )
        ],
      ),
    );
  }
}
