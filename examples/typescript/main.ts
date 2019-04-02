const jsom = require("csom-node");
const settings = require("../settings.js").settings;
const AuthenticationContext = jsom.AuthenticationContext;
export interface ICredentials {}

export class UserCredentials implements ICredentials {
  username: string;
  password: string;
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}

export class ClientCredentials implements ICredentials {
  clientId: string;
  secretKey: string;
  constructor(clientId: string, password: string) {
    this.clientId = clientId;
    this.secretKey = password;
  }
}

export async function executeQuery(
  context: SP.ClientContext
): Promise<SP.ClientContext> {
  return new Promise<SP.ClientContext>((resolve, reject) => {
    context.executeQueryAsync(
      () => {
        resolve();
      },
      (sender, args) => {
        reject(args);
      }
    );
  });
}

export async function getAuthenticatedContext(
  url: string,
  credentials: UserCredentials | ClientCredentials
): Promise<SP.ClientContext> {
  jsom.setLoaderOptions({ url: url, packages: ["core", "taxonomy"] });
  const authCtx = new AuthenticationContext(url);

  return new Promise<SP.ClientContext>((resolve, reject) => {
    if (credentials instanceof UserCredentials) {
      authCtx.acquireTokenForUser(
        credentials.username,
        credentials.password,
        (err: any, resp: any) => {
          if (err) {
            reject(err);
            return;
          }
          const ctx = new SP.ClientContext(authCtx.path);
          authCtx.setAuthenticationCookie(ctx);
          resolve(ctx);
        }
      );
    } else {
      authCtx.acquireTokenForApp(
        credentials.clientId,
        encodeURIComponent(credentials.secretKey),
        (err: any, resp: any) => {
          if (err) {
            reject(err);
            return;
          }
          const ctx = new SP.ClientContext(authCtx.path);
          authCtx.setAuthenticationCookie(ctx);
          resolve(ctx);
        }
      );
    }
  });
}

(async () => {
  const credentials = new UserCredentials(settings.username, settings.password);
  const ctx = await getAuthenticatedContext(settings.siteUrl, credentials);
  const web = ctx.get_web();
  ctx.load(web);
  await executeQuery(ctx);
  console.log(web.get_title());
})();
