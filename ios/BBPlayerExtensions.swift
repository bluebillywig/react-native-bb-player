import Foundation
import bbnativeshared

extension Project {
    func toDictionary() -> [String: Any?] {
        return [
            "id": self.id,
            "title": self.title,
            "deeplink": self.deeplink,
            "status": self.status,
            "createddate": self.createddate,
            "thumbnails": self.thumbnails?.map { $0.toDictionary() },
            "name": self.name,
            "createdBy": self.createdBy,
            "updateddate": self.updateddate,
            "updatedBy": self.updatedBy,
            "subtype": self.subtype,
            "cat": self.cat,
            "clipCount": self.clipCount?.int64Value,
            "publisheddate": self.publisheddate,
            "useGaplessPlayback": self.useGaplessPlayback?.boolValue,
            "distribution": self.distribution,
            "goal": self.goal,
            "useGaplessMetadata": self.useGaplessMetadata?.boolValue,
            "useThumbsFromMetadata": self.useThumbsFromMetadata,
            "noIntroClip": self.noIntroClip?.boolValue,
            "analysis": self.analysis,
            "description": self.description,
            "author": self.author,
            "copyright": self.copyright,
            "transcript": self.transcript,
            "label": self.label,
            "chapters": self.chapters?.map { $0.toDictionary() },
            "timelineId": self.timelineId,
            "timelines": self.timelines?.map { $0.toDictionary() },
            "mainMediaClipId": self.mainMediaClipId,
            "mainMediaClipData": self.mainMediaClipData?.toDictionary(),
        ]
    }
}

extension MediaClip {
    func toDictionary() -> [String: Any?] {
        let dateDict = [
            "created": self.createddate,
            "updated": self.updateddate,
            "published": self.publisheddate,
        ]

        return [
            "id": self.id,
            "title": self.title,
            "deeplink": self.deeplink,
            "gendeeplink": self.gendeeplink,
            "sourcetype": self.sourcetype,
            "length": self.length,
            "mediatype": self.mediatype,
            "mediatype_override": self.mediatype_override,
            "fitmode": self.fitmode,
            "usetype": self.usetype,
            "useThumbsFromMetadata": self.useThumbsFromMetadata,
            "location": self.location,
            "originalfilename": self.originalfilename,
            "sourceid": self.sourceid,
            "description": self.description,
            "copyright": self.copyright,
            "author": self.author,
            "status": self.status,
            "createddate": self.createddate,
            "updateddate": self.updateddate,
            "publisheddate": self.publisheddate,
            "width": self.width?.int64Value,
            "height": self.height?.int64Value,
            "dar": self.dar,
            "originalWidth": self.originalWidth?.int64Value,
            "originalHeight": self.originalHeight?.int64Value,
            "date": dateDict,
            "src": self.src,
            "cat": self.cat,
            "thumbnails": self.thumbnails?.map { $0.toDictionary() },
            "movingThumbnails": self.movingThumbnails?.map { $0.toDictionary() },
            "assets": self.assets?.map { $0.toDictionary() },
            "hasJobs": self.hasJobs,
            "hasFailedJobs": self.hasFailedJobs?.boolValue,
            "hasRunningJobs": self.hasRunningJobs?.boolValue,
            "hasNewJobs": self.hasNewJobs?.boolValue,
            "transcodingFinished": self.transcodingFinished?.boolValue,
            "isYoutubeImport": self.isYoutubeImport?.boolValue,
            "subtitles": self.subtitles?.map { $0.toDictionary() },
            "subtitvarracks": self.subtitletracks?.map { $0.toDictionary() },
            "transcript": self.transcript,
            "timelineId": self.timelineId,
            "timelines": self.timelines?.map { $0.toDictionary() },
            "audiotracks": self.audiotracks?.map { $0.toDictionary() },
            "youtubeImportID": self.youtubeImportID,
            "importSource": self.importSource,
            "importURL": self.importURL,
            "disablecommercials": self.disablecommercials,
            "isDynamic": self.isDynamic,
            "checkbox": self.checkbox,
            "comment": self.comment,
            "chapters": self.chapters?.map { $0.toDictionary() },
            "highlights": self.highlights?.map { $0.toDictionary() },
            "softEmbargo": self.softEmbargo,
            "isOutro": self.isOutro,
            "projectId": self.projectId,
        ]
    }
}

extension Thumbnail {
    func toDictionary() -> [String: Any?] {
        return [
            "src": self.src,
            "width": self.width,
            "height": self.height,
            "main": self.main?.boolValue,
        ]
    }
}

extension MediaAsset {
    func toDictionary() -> [String: Any?] {
        return [
            "mediatype": self.mediatype,
            "id": self.id,
            "status": self.status,
            "src": self.src,
            "length": self.length,
            "exactlength": self.exactlength,
            "width": self.width,
            "height": self.height,
            "bandwidth": self.bandwidth,
            "jobdefid": self.jobdefid,
            "languageId": self.languageId,
            "languageName": self.languageName,
            "languageIsocode": self.languageIsocode,
            "isDefaultLanguage": self.isDefaultLanguage?.boolValue,
            "title": self.title,
        ]
    }
}

extension Audiotrack {
    func toDictionary() -> [String: Any?] {
        return [
            "id": self.id,
            "type": self.type,
            "status": self.status,
            "createddate": self.createddate,
            "name": self.name,
            "createdBy": self.createdBy,
            "updateddate": self.updateddate,
            "updatedBy": self.updatedBy,
            "audioId": self.audioId?.intValue,
            "isocode": self.isocode,
            "roleFlags": self.roleFlags?.intValue,
            "mediaclipid": self.mediaclipid,
            "originalfilename": self.originalfilename,
            "languageid": self.languageid?.int64Value,
            "src": self.src,
            "remotesrc": self.remotesrc,
            "exactlength": self.exactlength,
            "publisheddate": self.publisheddate,
            "label": self.label,
            "uri": self.uri,
            "isDefaultLanguage": self.isDefaultLanguage?.boolValue,
            "isSelected": self.isSelected?.boolValue,
            "origId": self.origId,
        ]
    }
}

extension Highlight {
    func toDictionary() -> [String: Any?] {
        return [
            "id": self.id,
            "title": self.title,
            "timeOffset": self.timeOffset?.floatValue,
        ]
    }
}

extension Timeline {
    func toDictionary() -> [String: Any?] {
        return [
            "id": self.id
        ]
    }
}

extension Chapter {
    func toDictionary() -> [String: Any?] {
        return [
            "id": self.id,
            "title": self.title,
            "timeOffset": self.timeOffset?.floatValue,
            "steps": self.steps?.map { $0.toDictionary() },
        ]
    }
}

extension Step {
    func toDictionary() -> [String: Any?] {
        return [
            "id": self.id,
            "mediaClipId": self.mediaClipId,
            "isStart": self.isStart?.boolValue,
            "entityType": self.entityType,
            "entityId": self.entityId,
        ]
    }
}

extension Dates {
    func toDictionary() -> [String: Any?] {
        return [
            "created": self.created,
            "updated": self.updated,
            "published": self.published,
        ]
    }
}

extension Subtitle {
    func toDictionary() -> [String: Any?] {
        return [
            "languageid": self.languageid,
            "languagename": self.languagename,
            "id": self.id,
            "name": self.name,
            "default": self.default_,
            "isocode": self.isocode,
            "roleFlags": self.roleFlags?.intValue,
            "status": self.status,
            "isSelected": self.isSelected?.boolValue,
        ]
    }
}

extension Player {
    func toDictionary() -> [String: Any?] {
        return [
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "src": self.src,
            "updateddate": self.updateddate,
        ]
    }
}

extension AdUnit {
    func toDictionary() -> [String: Any?] {
        return [
            "id": self.id,
            "type": self.type,
            "status": self.status,
            "createddate": self.createddate,
            "createdBy": self.createdBy,
            "updateddate": self.updateddate,
            "updatedBy": self.updatedBy,
            "positionType": self.positionType,
            "positionDisplayType": self.positionDisplayType,
            "playoutCode": self.playoutCode,
            "title": self.title,
            "code": self.code,
            "assignedLineitems": self.assignedLineitems,
            "label": self.label,
            "lineitems": self.lineitems?.map { $0.toDictionary() },
        ]
    }
}

extension LineItem_ {
    func toDictionary() -> [String: Any?] {
        var playoutDict: [String: String?]? = nil
        if let playout = self.playout {
            playoutDict = playout.mapValues { value in
                return value as? String
            }
        }

        return [
            "id": self.id,
            "type": self.type,
            "status": self.status,
            "createddate": self.createddate,
            "createdBy": self.createdBy,
            "updateddate": self.updateddate,
            "updatedBy": self.updatedBy,
            "creativeType": self.creativeType,
            "creativeId": self.creativeId,
            "timeout": self.timeout?.int64Value,
            "preferredPlayMode": self.preferredPlayMode,
            "playout": playoutDict,
            "title": self.title,
            "code": self.code,
            "vastUrl": self.vastUrl,
            "vastSubtype": self.vastSubtype,
            "label": self.label,
            "relatedAdUnits": nil,
        ]
    }
}

extension MediaClipList {
    func toDictionary() -> [String: Any?] {
        let items = self.items?.compactMap { item -> [String: Any?]? in
            if let mediaClip = item as? MediaClip {
                return mediaClip.toDictionary()
            } else if let project = item as? Project {
                return project.toDictionary()
            }
            return nil
        }

        return [
            "id": self.id,
            "title": self.title,
            "deeplink": self.deeplink,
            "numfound": self.numfound?.int64Value,
            "offset": self.offset?.int64Value,
            "parentid": self.parentid,
            "status": self.status,
            "publication": self.publication,
            "parentpublicationid": self.parentpublicationid,
            "mediatype": self.mediatype,
            "usetype": self.usetype,
            "modifieddate": self.modifieddate,
            "createddate": self.createddate,
            "publishedDate": self.publishedDate,
            "listtypeString": self.listtypeString,
            "isEmptyBoolean": self.isEmptyBoolean?.boolValue,
            "filtersString": self.filtersString,
            "createdbyString": self.createdbyString,
            "updatedbyString": self.updatedbyString,
            "allowDatasource": self.allowDatasource,
            "allowDatasource_boolean": self.allowDatasource_boolean?.boolValue,
            "score": self.score?.doubleValue,
            "count": self.count?.int64Value,
            "items": items,
        ]
    }
}

extension Playout {
    func toDictionary() -> [String: Any?] {
        return [
            "id": self.id,
            "main": self.main,
            "type": self.type,
            "name": self.name,
            "status": self.status,
            "createddate": self.createddate,
            "updateddate": self.updateddate,
            "label": self.label,
            "publication": self.publication,
            "player": self.player?.toDictionary(),
            "playerid": self.playerid,
            "centerButtonType": self.centerButtonType,
            "cornerRadius": self.cornerRadius,
            "responsiveSizing": self.responsiveSizing,
            "aspectRatio": self.aspectRatio,
            "width": self.width,
            "height": self.height,
            "autoHeight": self.autoHeight,
            "alphaControlBar": self.alphaControlBar,
            "skin_backgroundColor": self.skin_backgroundColor,
            "skin_foregroundColor": self.skin_foregroundColor,
            "skin_widgetColor": self.skin_widgetColor,
            "bgColor": self.bgColor,
            "logoId": self.logoId,
            "logoAlign": self.logoAlign,
            "controlBar": self.controlBar,
            "controlBarPlacement": self.controlBarPlacement,
            "timeDisplay": self.timeDisplay,
            "timeLine": self.timeLine,
            "muteButton": self.muteButton,
            "volume": self.volume,
            "volumeOrientation": self.volumeOrientation,
            "languageSelect": self.languageSelect,
            "qualitySelector": self.qualitySelector,
            "playbackRateSelector": self.playbackRateSelector,
            "fullScreen": self.fullScreen,
            "showStartControlBar": self.showStartControlBar,
            "shareButton": self.shareButton,
            "shareButtonPause": self.shareButtonPause,
            "shareButtonEnd": self.shareButtonEnd,
            "shareButtonEmbedCode": self.shareButtonEmbedCode,
            "shareButtonEmail": self.shareButtonEmail,
            "shareButtonFacebook": self.shareButtonFacebook,
            "shareButtonLinkedIn": self.shareButtonLinkedIn,
            "shareButtonPinterest": self.shareButtonPinterest,
            "shareButtonTwitter": self.shareButtonTwitter,
            "shareButtonWhatsApp": self.shareButtonWhatsApp,
            "castButton": self.castButton,
            "showBigPlayButton": self.showBigPlayButton,
            "showBigReplayButton": self.showBigReplayButton,
            "title": self.title,
            "date": self.date,
            "authorCopyright": self.authorCopyright,
            "authorCopyrightAlign": self.authorCopyrightAlign,
            "authorCopyrightPrefixText": self.authorCopyrightPrefixText,
            "autoPlayNext": self.autoPlayNext,
            "relatedItems": self.relatedItems,
            "relatedItemsPause": self.relatedItemsPause,
            "useDeeplinkForRelatedItems": self.useDeeplinkForRelatedItems,
            "useDeeplinkForRelatedItemsPause": self.useDeeplinkForRelatedItemsPause,
            "exitscreenItemsListId": self.exitscreenItemsListId,
            "randomizeRelatedItems": self.randomizeRelatedItems,
            "useDeeplinkForFacebook": self.useDeeplinkForFacebook,
            "shareTwitterText": self.shareTwitterText,
            "sharePlayout": self.sharePlayout,
            "skinBehaviour": self.skinBehaviour,
            "skinOnTimeline": self.skinOnTimeline,
            "nativeControls": self.nativeControls,
            "youTubeHosting": self.youTubeHosting,
            "youTubeSkinInMainPhase": self.youTubeSkinInMainPhase,
            "forceNativeFullscreen": self.forceNativeFullscreen,
            "preferHD": self.preferHD,
            "nedStatLoggerUrl": self.nedStatLoggerUrl,
            "googleAnalyticsId": self.googleAnalyticsId,
            "piwikUrl": self.piwikUrl,
            "piwikSiteId": self.piwikSiteId,
            "disableCookies": self.disableCookies,
            "disableContextMenuNavigate": self.disableContextMenuNavigate,
            "playerSignature": self.playerSignature,
            "playerSignatureLink": self.playerSignatureLink,
            "autoPlay": self.autoPlay,
            "autoMute": self.autoMute,
            "autoMuteIfNeededForAutoPlay": self.autoMuteIfNeededForAutoPlay,
            "autoLoop": self.autoLoop,
            "floatPlayer": self.floatPlayer,
            "interactivityInView": self.interactivityInView,
            "interactivityOutView": self.interactivityOutView,
            "inviewMargin": self.inviewMargin,
            "textAbovePlayer": self.textAbovePlayer,
            "textCommercialSkip": self.textCommercialSkip,
            "startCollapsed": self.startCollapsed,
            "playInOverlay": self.playInOverlay,
            "hidePlayerOnEnd": self.hidePlayerOnEnd,
            "waitForApproval": self.waitForApproval,
            "interactivityMouseIn": self.interactivityMouseIn,
            "interactivityMouseOut": self.interactivityMouseOut,
            "interactivityOnClick": self.interactivityOnClick,
            "clickURL": self.clickURL,
            "nsiNoAutoPlay": self.nsiNoAutoPlay,
            "nsiNoPlayer": self.nsiNoPlayer,
            "placementOption": self.placementOption,
            "placementDOMSelector": self.placementDOMSelector,
            "iframeBreakout": self.iframeBreakout,
            "clearBothOption": self.clearBothOption,
            "forceInview": self.forceInview,
            "customCode": self.customCode,
            "preferFlashPlayback": self.preferFlashPlayback,
            "preloadMainroll": self.preloadMainroll,
            "disableHtml5VPAID": self.disableHtml5VPAID,
            "enableHtml5VPAID": self.enableHtml5VPAID,
            "commercialPauseButton": self.commercialPauseButton,
            "commercialMuteButton": self.commercialMuteButton,
            "commercialAdIcon": self.commercialAdIcon,
            "commercialProgressBar": self.commercialProgressBar,
            "commercialProgressBarColor": self.commercialProgressBarColor,
            "commercials": self.commercials,
            "textCommercialTimeRemaining": self.textCommercialTimeRemaining,
            "commercialBehaviour": self.commercialBehaviour,
            "minClipDurationPreroll": self.minClipDurationPreroll,
            "minClipDurationPostroll": self.minClipDurationPostroll,
            "allowBBIma": self.allowBBIma,
            "fitmode": self.fitmode,
            "mobileRotateOnFullScreenMismatch": self.mobileRotateOnFullScreenMismatch,
            "noStats": self.noStats,
            "forceAndroidNativeVideo": self.forceAndroidNativeVideo,
            "forceIOSNativeVideo": self.forceIOSNativeVideo,
            "use2018Skin": self.use2018Skin,
            "useThumbsFromMetadata": self.useThumbsFromMetadata,
            "audioTrackSelect": self.audioTrackSelect,
            "shareText": self.shareText,
            "shareButtonDirectLink": self.shareButtonDirectLink,
            "googleAnalyticsCustomVars": self.googleAnalyticsCustomVars,
            "supportIABConsent": self.supportIABConsent,
            "restrictionNpaOnly": self.restrictionNpaOnly,
            "restrictionNpcOnly": self.restrictionNpcOnly,
            "defaultSubtitle": self.defaultSubtitle,
            "defaultSubtitleOnlyIfMuted": self.defaultSubtitleOnlyIfMuted,
            "defaultAudioTrack": self.defaultAudioTrack,
            "forceCanAutoPlay": self.forceCanAutoPlay,
            "avoidMutedAutoplay": self.avoidMutedAutoplay,
            "stickyMode": self.stickyMode,
            "disableKeyboardControls": self.disableKeyboardControls,
            "taggingDisabled": self.taggingDisabled,
            "skipOffset": self.skipOffset,
            "skipCounterText": self.skipCounterText,
            "skipButtonText": self.skipButtonText,
            "blockInsecureVPAID": self.blockInsecureVPAID,
            "shareButtonGooglePlus": self.shareButtonGooglePlus,
            "timelineId": self.timelineId,
            "templateId": self.templateId,
            "adunits": self.adunits,
            "hasAdunits": self.hasAdunits?.boolValue,
            "adunitsPreroll": self.adunitsPreroll?.map { $0.toDictionary() },
            "ignoreSingleMediaResource": self.ignoreSingleMediaResource,
            "ignoreProjectMetadata": self.ignoreProjectMetadata,
            "noPosterInExitPhase": self.noPosterInExitPhase,
            "logProgressAsQuartiles": self.logProgressAsQuartiles,
            "autoPauseAfterPrePhase": self.autoPauseAfterPrePhase,
            "autoPlayOnlyWithPrerollAd": self.autoPlayOnlyWithPrerollAd,
            "showOnlyWhenPrerollAvailable": self.showOnlyWhenPrerollAvailable,
            "showBigPauseButtons": self.showBigPauseButtons,
            "titlePause": self.titlePause,
            "authorCopyrightPause": self.authorCopyrightPause,
            "authorCopyrightAlignPause": self.authorCopyrightAlignPause,
            "authorCopyrightPrefixTextPause": self.authorCopyrightPrefixTextPause,
            "showStartDuration": self.showStartDuration,
            "disableMovingThumbnail": self.disableMovingThumbnail,
            "shareButtonHover": self.shareButtonHover,
            "showBigHoverButtons": self.showBigHoverButtons,
            "titleHover": self.titleHover,
            "authorCopyrightHover": self.authorCopyrightHover,
            "titleEnd": self.titleEnd,
            "authorCopyrightEnd": self.authorCopyrightEnd,
            "softEmbargoCustomPosterClipId": self.softEmbargoCustomPosterClipId,
            "softEmbargoFontColor": self.softEmbargoFontColor,
            "softEmbargoHasCustomPoster": self.softEmbargoHasCustomPoster,
            "softEmbargoText": self.softEmbargoText,
            "softEmbargoTimerHidden": self.softEmbargoTimerHidden,
            "adsystem_buid": self.adsystem_buid,
            "adsystem_rdid": self.adsystem_rdid,
            "adsystem_idtype": self.adsystem_idtype,
            "adsystem_is_lat": self.adsystem_is_lat,
            "swipeDirection": self.swipeDirection,
            "hideSwipeControls": self.hideSwipeControls,
            "descriptionShowHide": self.descriptionShowHide,
            "showPlayButton": self.showPlayButton,
            "autoLoopClip": self.autoLoopClip,
            "shortsId": self.shortsId,
            "adunitId": self.adunitId,
            "clipAdInterval": self.clipAdInterval,
            "assetPreloadWindow": self.assetPreloadWindow,
            "ctaUrlField": self.ctaUrlField,
            "ctaButtonText": self.ctaButtonText,
            "ctaButtonUseAccentColor": self.ctaButtonUseAccentColor,
            "ctaButtonPosition": self.ctaButtonPosition,
        ]
    }
}
