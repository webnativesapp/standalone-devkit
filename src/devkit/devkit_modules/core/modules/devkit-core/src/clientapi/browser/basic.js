var isSimulator = GLOBAL.CONFIG && !!CONFIG.simulator;
if (!isSimulator) {
    // start the cache service-worker
    import .cache;
}
jsio('import src.ui.Main as Main');
