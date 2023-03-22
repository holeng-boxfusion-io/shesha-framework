﻿using Abp.AspNetCore;
using Abp.AspNetCore.Configuration;
using Abp.Dependency;
using Abp.Modules;
using Abp.Zero;
using Shesha.Firebase;
using Shesha.Firebase.Configuration;
using Shesha.Modules;
using Shesha.Settings.Ioc;
using System.Reflection;

namespace Shesha
{
    /// <summary>
    /// This module extends module zero to add Firebase notifications.
    /// </summary>
    [DependsOn(typeof(AbpZeroCommonModule), typeof(AbpAspNetCoreModule))]
    public class SheshaFirebaseModule : SheshaModule
    {
        public const string ModuleName = "Shesha.Firebase";
        public override SheshaModuleInfo ModuleInfo => new SheshaModuleInfo(ModuleName)
        {
            FriendlyName = "Shesha Firebase",
            Publisher = "Boxfusion"
        };

        public override void PreInitialize()
        {
            Configuration.Modules.AbpAspNetCore().CreateControllersForAppServices(
                this.GetType().Assembly,
                moduleName: "SheshaFirebase",
                useConventionalHttpVerbs: true);
        }

        public override void Initialize()
        {
            IocManager.RegisterSettingAccessor<IFirebaseSettings>();

            IocManager.Register<FirebaseAppService, FirebaseAppService>(DependencyLifeStyle.Transient);

            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());
        }
    }
}
