import { provideServerRendering, renderModule } from "@angular/platform-server"

import { AppModule } from "./app/app.module";

const bootstrap = () => renderModule(AppModule, {extraProviders: [provideServerRendering()]});
// bootstrapApplication(AppComponent, config);

export default bootstrap;
