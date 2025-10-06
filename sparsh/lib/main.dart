import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sparsh/state/tab_manager.dart';
import 'package:sparsh/pages/browser_home_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const SparshApp());
}

class SparshApp extends StatelessWidget {
  const SparshApp({super.key});

  @override
  Widget build(BuildContext context) {
    final Color seed = const Color(0xFF6A5ACD); // Spàrsh brand seed
    final ThemeData light = ThemeData(
      colorScheme: ColorScheme.fromSeed(seedColor: seed, brightness: Brightness.light),
      useMaterial3: true,
      visualDensity: VisualDensity.adaptivePlatformDensity,
    );
    final ThemeData dark = ThemeData(
      colorScheme: ColorScheme.fromSeed(seedColor: seed, brightness: Brightness.dark),
      useMaterial3: true,
      visualDensity: VisualDensity.adaptivePlatformDensity,
    );

    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => TabManager()..initialize()),
      ],
      child: MaterialApp(
        title: 'Spàrsh',
        theme: light,
        darkTheme: dark,
        home: const BrowserHomePage(),
      ),
    );
  }
}
