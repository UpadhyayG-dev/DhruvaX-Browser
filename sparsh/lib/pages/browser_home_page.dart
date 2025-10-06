import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:provider/provider.dart';
import 'package:sparsh/state/tab_manager.dart';
import 'package:sparsh/widgets/address_bar.dart';
import 'package:sparsh/widgets/tab_strip.dart';

class BrowserHomePage extends StatefulWidget {
  const BrowserHomePage({super.key});

  @override
  State<BrowserHomePage> createState() => _BrowserHomePageState();
}

class _BrowserHomePageState extends State<BrowserHomePage> {
  final TextEditingController _omnibox = TextEditingController();
  InAppWebViewSettings get _webSettings => InAppWebViewSettings(
        isInspectable: true,
        incognito: _activeTab?.isPrivate ?? false,
        javaScriptEnabled: true,
        transparentBackground: false,
        allowsInlineMediaPlayback: true,
        mediaPlaybackRequiresUserGesture: true,
        useHybridComposition: true,
        supportZoom: true,
      );

  BrowserTab? get _activeTab => context.read<TabManager>().activeTab;

  @override
  void dispose() {
    _omnibox.dispose();
    super.dispose();
  }

  WebUri _toUrl(String input) {
    final String trimmed = input.trim();
    if (trimmed.isEmpty) {
      return WebUri('about:blank');
    }
    final bool looksLikeUrl = trimmed.contains('.') || trimmed.startsWith('http');
    if (looksLikeUrl) {
      final Uri uri = Uri.tryParse(trimmed) ?? Uri.parse('https://$trimmed');
      final Uri httpsUri = uri.scheme.isEmpty ? uri.replace(scheme: 'https') : uri;
      return WebUri.uri(httpsUri);
    }
    final String query = Uri.encodeQueryComponent(trimmed);
    return WebUri('https://www.google.com/search?q=$query');
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<TabManager>(
      builder: (context, tabs, _) {
        final BrowserTab? active = tabs.activeTab;
        final String addressText = active?.url?.toString() ?? '';
        final List<TabStripItem> stripModel = tabs.tabs
            .map((t) => TabStripItem(id: t.id, title: t.title, isPrivate: t.isPrivate))
            .toList(growable: false);

        return Scaffold(
          backgroundColor: Theme.of(context).colorScheme.surface,
          appBar: PreferredSize(
            preferredSize: const Size.fromHeight(88),
            child: SafeArea(
              bottom: false,
              child: Column(
                children: [
                  // Tab strip
                  TabStrip(
                    tabs: stripModel,
                    activeIndex: tabs.activeIndex,
                    onAdd: () => tabs.addNewTab(isPrivate: false, initialUrl: null),
                    onClose: tabs.closeTab,
                    onTap: tabs.switchTo,
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    child: Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.arrow_back),
                          onPressed: active?.controller == null
                              ? null
                              : () async {
                                  if (await active!.controller!.canGoBack()) {
                                    await active.controller!.goBack();
                                  }
                                },
                        ),
                        IconButton(
                          icon: const Icon(Icons.arrow_forward),
                          onPressed: active?.controller == null
                              ? null
                              : () async {
                                  if (await active!.controller!.canGoForward()) {
                                    await active.controller!.goForward();
                                  }
                                },
                        ),
                        IconButton(
                          icon: const Icon(Icons.refresh),
                          onPressed: active?.controller == null
                              ? null
                              : () async {
                                  await active!.controller!.reload();
                                },
                        ),
                        Expanded(
                          child: AddressBar(
                            text: addressText,
                            onSubmit: (value) {
                              final WebUri url = _toUrl(value);
                              active?.controller?.loadUrl(urlRequest: URLRequest(url: url));
                            },
                            onMenu: () {},
                          ),
                        ),
                        const SizedBox(width: 8),
                        FilledButton.tonalIcon(
                          onPressed: () => tabs.addNewTab(isPrivate: true, initialUrl: null),
                          icon: const Icon(Icons.visibility_off),
                          label: const Text('Private'),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          body: active == null
              ? const SizedBox.shrink()
              : Column(
                  children: [
                    if (active.progress < 1.0 && active.progress > 0)
                      LinearProgressIndicator(value: active.progress, minHeight: 2),
                    Expanded(
                      child: InAppWebView(
                        initialSettings: _webSettings,
                        initialUrlRequest: active.initialUrl != null
                            ? URLRequest(url: active.initialUrl!)
                            : null,
                        onWebViewCreated: (controller) {
                          active.controller = controller;
                        },
                        onProgressChanged: (controller, progress) {
                          tabs.updateActive((t) {
                            t.progress = progress / 100.0;
                            return t;
                          });
                        },
                        onTitleChanged: (controller, title) {
                          tabs.updateActive((t) {
                            t.title = title ?? '';
                            return t;
                          });
                        },
                        onLoadStart: (controller, url) {
                          tabs.updateActive((t) {
                            t.url = url;
                            return t;
                          });
                        },
                        onLoadStop: (controller, url) {
                          tabs.updateActive((t) {
                            t.url = url;
                            t.progress = 1.0;
                            return t;
                          });
                        },
                        shouldOverrideUrlLoading: (controller, navAction) async {
                          // Allow all for now
                          return NavigationActionPolicy.ALLOW;
                        },
                        onDownloadStartRequest: (controller, req) async {
                          // TODO: integrate download manager
                        },
                      ),
                    ),
                  ],
                ),
          floatingActionButton: FloatingActionButton.extended(
            onPressed: () => tabs.addNewTab(isPrivate: false, initialUrl: null),
            label: const Text('New Tab'),
            icon: const Icon(Icons.add),
          ),
        );
      },
    );
  }
}

// no-op: types migrated to TabStripItem
