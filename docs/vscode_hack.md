

```js
 get entitlement() {
    // return this.a.getContextKeyValue($n.Entitlement.planPro.key) === !0
    //   ? os.Pro
    //   : this.a.getContextKeyValue($n.Entitlement.planBusiness.key) === !0
    //     ? os.Business
    //     : this.a.getContextKeyValue($n.Entitlement.planEnterprise.key) === !0
    //       ? os.Enterprise
    //       : this.a.getContextKeyValue($n.Entitlement.planProPlus.key) === !0
    //         ? os.ProPlus
    //         : this.a.getContextKeyValue($n.Entitlement.planFree.key) === !0
    //           ? os.Free
    //           : this.a.getContextKeyValue($n.Entitlement.canSignUp.key) === !0
    //             ? os.Available
    //             : this.a.getContextKeyValue($n.Entitlement.signedOut.key) === !0
    //               ? os.Unknown
    //               : os.Unresolved;
    return os.Free;
  }
  get isInternal() {
    return this.a.getContextKeyValue($n.Entitlement.internal.key) === !0;
  }
  get organisations() {
    // return this.a.getContextKeyValue($n.Entitlement.organisations.key);
    return [];

  }
  get sku() {
    // return this.a.getContextKeyValue($n.Entitlement.sku.key);
    return "free_limited_copilot";
  }
  get quotas() {
    return this.h;
  }
  q() {
    const e = new Set([
        this.n.chatQuotaExceeded,
        this.n.completionsQuotaExceeded,
      ]),
      t = this.D(new Le());
    this.D(
      this.a.onDidChangeContext((o) => {
        o.affectsSome(e) &&
          (t.value && t.value.cancel(),
          (t.value = new ut()),
          this.update(t.value.token));
      }),
    );
    let s = this.anonymous;
    const n = () => {
      const o = this.anonymous;
      o !== s &&
        ((s = o),
        this.u.set(o),
        this.context?.hasValue && nii(this.context.value.state, this.b, this.c),
        this.w.fire());
    };
    (this.D(
      this.b.onDidChangeConfiguration((o) => {
        o.affectsConfiguration(sii) && n();
      }),
    ),
      this.D(this.onDidChangeEntitlement(() => n())),
      this.D(this.onDidChangeSentiment(() => n())));
  }
  acceptQuotas(e) {
    const t = this.h;
    ((this.h = e), this.t());
    const { changed: s } = this.r(t.chat, e.chat),
      { changed: n } = this.r(t.completions, e.completions),
      { changed: o } = this.r(t.premiumChat, e.premiumChat);
    ((s.exceeded || n.exceeded || o.exceeded) && this.f.fire(),
      (s.remaining || n.remaining || o.remaining) && this.g.fire());
  }
  r(e, t) {
    return {
      changed: {
        exceeded: (e?.percentRemaining === 0) != (t?.percentRemaining === 0),
        remaining: e?.percentRemaining !== t?.percentRemaining,
      },
    };
  }
  clearQuotas() {
    this.acceptQuotas({});
  }
  t() {
    (this.j.set(this.h.chat?.percentRemaining === 0),
      this.m.set(this.h.completions?.percentRemaining === 0));
  }
  get sentiment() {
    // return {
    //   installed: this.a.getContextKeyValue($n.Setup.installed.key) === !0,
    //   hidden: this.a.getContextKeyValue($n.Setup.hidden.key) === !0,
    //   disabled: this.a.getContextKeyValue($n.Setup.disabled.key) === !0,
    //   untrusted: this.a.getContextKeyValue($n.Setup.untrusted.key) === !0,
    //   later: this.a.getContextKeyValue($n.Setup.later.key) === !0,
    //   registered: this.a.getContextKeyValue($n.Setup.registered.key) === !0,
    // };
    return {
       installed: this.a.getContextKeyValue($n.Setup.installed.key) === !0,
      hidden: this.a.getContextKeyValue($n.Setup.hidden.key) === !0,
      disabled: false,
      untrusted: false,
      later: this.a.getContextKeyValue($n.Setup.later.key) === !0,
      registered: true,
    };
  }
  get anonymous() {
    // return l_e(this.b, this.entitlement, this.sentiment);
    return false;
  }
```