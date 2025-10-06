import 'package:flutter/foundation.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

class BrowserTab {
  BrowserTab({required this.id, required this.isPrivate, this.initialUrl});

  final String id;
  final bool isPrivate;
  final WebUri? initialUrl;
  InAppWebViewController? controller;
  String title = '';
  WebUri? url;
  double progress = 0.0;
}

class TabManager extends ChangeNotifier {
  final List<BrowserTab> _tabs = <BrowserTab>[];
  int _activeIndex = 0;

  List<BrowserTab> get tabs => List.unmodifiable(_tabs);
  int get activeIndex => _activeIndex;
  BrowserTab? get activeTab =>
      _tabs.isEmpty ? null : (_activeIndex >= 0 && _activeIndex < _tabs.length ? _tabs[_activeIndex] : null);

  Future<void> initialize() async {
    await _ensureWebViewInitialized();
    if (_tabs.isEmpty) {
      addNewTab(isPrivate: false, initialUrl: null);
    }
  }

  Future<void> _ensureWebViewInitialized() async {
    await InAppWebViewController.setWebContentsDebuggingEnabled(true);
  }

  void addNewTab({required bool isPrivate, WebUri? initialUrl}) {
    final BrowserTab tab = BrowserTab(
      id: DateTime.now().microsecondsSinceEpoch.toString(),
      isPrivate: isPrivate,
      initialUrl: initialUrl,
    );
    _tabs.add(tab);
    _activeIndex = _tabs.length - 1;
    notifyListeners();
  }

  void closeTab(String id) {
    final int index = _tabs.indexWhere((t) => t.id == id);
    if (index == -1) return;
    _tabs.removeAt(index);
    if (_activeIndex >= _tabs.length) {
      _activeIndex = _tabs.length - 1;
    }
    notifyListeners();
  }

  void switchTo(int index) {
    if (index < 0 || index >= _tabs.length) return;
    _activeIndex = index;
    notifyListeners();
  }

  void updateActive(BrowserTab Function(BrowserTab) updater) {
    if (activeTab == null) return;
    final BrowserTab updated = updater(activeTab!);
    _tabs[_activeIndex] = updated;
    notifyListeners();
  }
}
